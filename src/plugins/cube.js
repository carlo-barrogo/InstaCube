import cubejs from '@cubejs-client/core';

const cubejsApi = cubejs(
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODkyOTg0MzUsImV4cCI6MTY4OTM4NDgzNX0.A2zdcr_OAn1XaStfkXska85CGac67nVvcFMLSqMW2oY", 
{ apiUrl: 'http://localhost:4000/cubejs-api/v1' });

export default cubejsApi;