// JavaScript Example: Reading Entities
// Filterable fields: ride_id, author_id, title, content, image_url, likes, tags, is_featured
async function fetchStoryEntities() {
    const response = await fetch(`https://app.base44.com/api/apps/688347ad96c03b454b3e55db/entities/Story`, {
        headers: {
            'api_key': 'e0936f79fab144b4a7148255ead64e03', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);
}

// JavaScript Example: Updating an Entity
// Filterable fields: ride_id, author_id, title, content, image_url, likes, tags, is_featured
async function updateStoryEntity(entityId, updateData) {
    const response = await fetch(`https://app.base44.com/api/apps/688347ad96c03b454b3e55db/entities/Story/${entityId}`, {
        method: 'PUT',
        headers: {
            'api_key': 'e0936f79fab144b4a7148255ead64e03', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    console.log(data);
}