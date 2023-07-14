import cubejs from '@cubejs-client/core';

const cubejsApi = cubejs('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODkzMTA5NzcsImV4cCI6MTY4OTM5NzM3N30.4rem_QjUxaexCHZgn4y851jmJYsQMn4aQlAWH9yFET4', { 
    apiUrl: "http://localhost:4000/cubejs-api/v1" 
});

export default cubejsApi;