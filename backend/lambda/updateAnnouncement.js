const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.ANNOUNCEMENTS_TABLE || 'Announcements';

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  const { id, title, content, categories, status } = event.arguments.input;
  
  if (!id) {
    throw new Error('Announcement ID is required');
  }

  let updateExpression = 'SET lastUpdate = :lastUpdate';
  const expressionAttributeValues = {
    ':lastUpdate': new Date().toISOString()
  };
  
  if (title !== undefined) {
    updateExpression += ', title = :title';
    expressionAttributeValues[':title'] = title;
  }
  
  if (content !== undefined) {
    updateExpression += ', content = :content';
    expressionAttributeValues[':content'] = content;
  }
  
  if (categories !== undefined && categories.length > 0) {
    updateExpression += ', categories = :categories';
    expressionAttributeValues[':categories'] = categories;
  }
  
  if (status !== undefined) {
    updateExpression += ', #status = :status';
    expressionAttributeValues[':status'] = status;
  }
  
  const params = {
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ExpressionAttributeNames: status !== undefined ? { '#status': 'status' } : undefined,
    ReturnValues: 'ALL_NEW'
  };
  
  try {
    const result = await dynamodb.update(params).promise();
    console.log('Updated announcement:', id);
    return result.Attributes;
  } catch (error) {
    console.error('Error updating announcement:', error);
    throw new Error(`Failed to update announcement with ID: ${id}`);
  }
};
