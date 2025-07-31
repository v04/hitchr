// JavaScript Example: Reading Entities
// Filterable fields: title, description, type, requirements, rewards, start_date, end_date, participants, completion_count, is_active
async function fetchQuestEntities() {
    const response = await fetch(`https://app.base44.com/api/apps/688347ad96c03b454b3e55db/entities/Quest`, {
        headers: {
            'api_key': 'e0936f79fab144b4a7148255ead64e03', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);
}

// JavaScript Example: Updating an Entity
// Filterable fields: title, description, type, requirements, rewards, start_date, end_date, participants, completion_count, is_active
async function updateQuestEntity(entityId, updateData) {
    const response = await fetch(`https://app.base44.com/api/apps/688347ad96c03b454b3e55db/entities/Quest/${entityId}`, {
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