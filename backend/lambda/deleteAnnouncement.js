const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.ANNOUNCEMENTS_TABLE || 'Announcements';

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  const { id } = event.arguments;
  
  if (!id) {
    throw new Error('Announcement ID is required');
  }

  const getParams = {
    TableName: TABLE_NAME,
    Key: { id }
  };
  
  try {
    const getResult = await dynamodb.get(getParams).promise();
    
    if (!getResult.Item) {
      console.log(`Announcement with ID ${id} not found`);
      return null;
    }

    const deleteParams = {
      TableName: TABLE_NAME,
      Key: { id }
    };
    
    await dynamodb.delete(deleteParams).promise();
    console.log('Deleted announcement:', id);
    
    return getResult.Item;
  } catch (error) {
    console.error('Error deleting announcement:', error);
    throw new Error(`Failed to delete announcement with ID: ${id}`);
  }
};
