const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.CATEGORIES_TABLE || 'Categories';


exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  const { name, slug, description } = event.arguments.input;

  if (!name || !name.trim()) {
    throw new Error('Category name is required');
  }
  
  if (!slug || !slug.trim()) {
    throw new Error('Category slug is required');
  }

  const checkParams = {
    TableName: TABLE_NAME,
    IndexName: 'slug-index',
    KeyConditionExpression: 'slug = :slug',
    ExpressionAttributeValues: {
      ':slug': slug
    }
  };
  
  try {
    const category = {
      id: uuidv4(),
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      description: description || ''
    };
    
    const params = {
      TableName: TABLE_NAME,
      Item: category
    };
    
    await dynamodb.put(params).promise();
    console.log('Created category:', category.id);
    
    return category;
  } catch (error) {
    console.error('Error creating category:', error);
    throw new Error('Failed to create category');
  }
};
