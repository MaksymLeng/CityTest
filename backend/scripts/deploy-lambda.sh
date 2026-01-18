#!/bin/bash

set -e

REGION="us-east-1"
ROLE_ARN="arn:aws:iam::561818313640:role/announcements-lambda-role"

echo "🚀 Starting Lambda deployment..."

# Перейти в директорию lambda
cd "$(dirname "$0")/../lambda"

# Установить зависимости
echo "📦 Installing dependencies..."
npm install

# Функции для деплоя
FUNCTIONS=(
  "listAnnouncements:ANNOUNCEMENTS_TABLE=Announcements"
  "getAnnouncement:ANNOUNCEMENTS_TABLE=Announcements"
  "createAnnouncement:ANNOUNCEMENTS_TABLE=Announcements"
  "updateAnnouncement:ANNOUNCEMENTS_TABLE=Announcements"
  "deleteAnnouncement:ANNOUNCEMENTS_TABLE=Announcements"
  "listCategories:CATEGORIES_TABLE=Categories"
  "createCategory:CATEGORIES_TABLE=Categories"
)

for FUNC_CONFIG in "${FUNCTIONS[@]}"; do
  IFS=':' read -r FUNC_NAME ENV_VAR <<< "$FUNC_CONFIG"
  IFS='=' read -r ENV_KEY ENV_VALUE <<< "$ENV_VAR"
  
  echo "📦 Packaging $FUNC_NAME..."
  
  # Создать ZIP архив
  npx bestzip "${FUNC_NAME}.zip" "${FUNC_NAME}.js" node_modules/
  
  # Проверить существует ли функция
  if aws lambda get-function --function-name "$FUNC_NAME" --region "$REGION" > /dev/null 2>&1; then
    echo "🔄 Updating $FUNC_NAME..."
    aws lambda update-function-code \
      --function-name "$FUNC_NAME" \
      --zip-file "fileb://${FUNC_NAME}.zip" \
      --region "$REGION"
    
    # Обновить environment variables
    aws lambda update-function-configuration \
      --function-name "$FUNC_NAME" \
      --environment "Variables={${ENV_KEY}=${ENV_VALUE}}" \
      --region "$REGION"
  else
    echo "✨ Creating $FUNC_NAME..."
    aws lambda create-function \
      --function-name "$FUNC_NAME" \
      --runtime nodejs18.x \
      --role "$ROLE_ARN" \
      --handler "${FUNC_NAME}.handler" \
      --zip-file "fileb://${FUNC_NAME}.zip" \
      --environment "Variables={${ENV_KEY}=${ENV_VALUE}}" \
      --timeout 30 \
      --memory-size 256 \
      --region "$REGION"
  fi
  
  echo "✅ $FUNC_NAME deployed successfully"
  
  # Удалить ZIP файл
  rm "${FUNC_NAME}.zip"
done

echo ""
echo "✅ All Lambda functions deployed successfully!"
echo ""
echo "Next steps:"
echo "1. Go to AWS AppSync Console"
echo "2. Create or update your GraphQL API"
echo "3. Attach Lambda functions as data sources"
echo "4. Configure resolvers"
