const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.CATEGORIES_TABLE || 'Categories';

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  const params = {
    TableName: TABLE_NAME
  };
  
  try {
    const result = await dynamodb.scan(params).promise();

    const sortedCategories = result.Items.sort((a, b) => 
      a.name.localeCompare(b.name)
    );
    
    return sortedCategories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
};
