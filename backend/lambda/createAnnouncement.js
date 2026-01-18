const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.ANNOUNCEMENTS_TABLE || 'Announcements';

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  // 1. Достаем publicationDate из входных данных
  const { title, content, categories, status = 'PUBLISHED', publicationDate } = event.arguments.input;

  if (!title || !title.trim()) {
    throw new Error('Title is required');
  }

  if (!categories || categories.length === 0) {
    throw new Error('At least one category is required');
  }

  // 2. Логика: Если дата пришла с фронта — берем её. Если нет — берем текущую.
  const dateToSave = publicationDate ? publicationDate : new Date().toISOString();
  const now = new Date().toISOString(); // Для lastUpdate всегда берем текущее время

  const announcement = {
    id: uuidv4(),
    title: title.trim(),
    content: content || '',
    categories,
    status,
    publicationDate: dateToSave, // Используем выбранную дату
    lastUpdate: now
  };

  const params = {
    TableName: TABLE_NAME,
    Item: announcement,
    ConditionExpression: 'attribute_not_exists(id)'
  };

  try {
    await dynamodb.put(params).promise();
    return announcement;
  } catch (error) {
    console.error('Error creating announcement:', error);
    throw new Error('Failed to create announcement');
  }
};