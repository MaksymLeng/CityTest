const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.ANNOUNCEMENTS_TABLE || 'Announcements';

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  const { limit = 20, nextToken, filter } = event.arguments;
  
  let params = {
    TableName: TABLE_NAME,
    Limit: limit
  };

  if (nextToken) {
    try {
      params.ExclusiveStartKey = JSON.parse(
        Buffer.from(nextToken, 'base64').toString('utf-8')
      );
    } catch (error) {
      console.error('Invalid nextToken:', error);
      throw new Error('Invalid pagination token');
    }
  }

  if (filter && filter.categories && filter.categories.length > 0) {
    params.FilterExpression = 'contains(categories, :cat)';
    params.ExpressionAttributeValues = {
      ':cat': filter.categories[0]
    };
  }

  if (filter && filter.status) {
    params.FilterExpression = params.FilterExpression 
      ? `${params.FilterExpression} AND #status = :status`
      : '#status = :status';
    params.ExpressionAttributeNames = { '#status': 'status' };
    params.ExpressionAttributeValues = {
      ...params.ExpressionAttributeValues,
      ':status': filter.status
    };
  }
  
  try {
    const result = await dynamodb.scan(params).promise();

    const sortedItems = result.Items.sort((a, b) => 
      new Date(b.publicationDate) - new Date(a.publicationDate)
    );

    let encodedNextToken = null;
    if (result.LastEvaluatedKey) {
      encodedNextToken = Buffer.from(
        JSON.stringify(result.LastEvaluatedKey)
      ).toString('base64');
    }
    
    return {
      items: sortedItems,
      nextToken: encodedNextToken
    };
  } catch (error) {
    console.error('Error fetching announcements:', error);
    throw new Error('Failed to fetch announcements');
  }
};
