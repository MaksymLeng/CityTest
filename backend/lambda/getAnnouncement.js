const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.ANNOUNCEMENTS_TABLE || 'Announcements';

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  const { id } = event.arguments;
  
  if (!id) {
    throw new Error('Announcement ID is required');
  }
  
  const params = {
    TableName: TABLE_NAME,
    Key: { id }
  };
  
  try {
    const result = await dynamodb.get(params).promise();
    
    if (!result.Item) {
      console.log(`Announcement with ID ${id} not found`);
      return null;
    }
    
    return result.Item;
  } catch (error) {
    console.error('Error fetching announcement:', error);
    throw new Error(`Failed to fetch announcement with ID: ${id}`);
  }
};
