// JavaScript Example: Reading Entities
// Filterable fields: name, description, category, route_points, distance_km, estimated_duration, difficulty, token_reward, special_badge, completed_by, featured_image, is_active
async function fetchHitchTrailEntities() {
    const response = await fetch(`https://app.base44.com/api/apps/688347ad96c03b454b3e55db/entities/HitchTrail`, {
        headers: {
            'api_key': 'e0936f79fab144b4a7148255ead64e03', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);
}

// JavaScript Example: Updating an Entity
// Filterable fields: name, description, category, route_points, distance_km, estimated_duration, difficulty, token_reward, special_badge, completed_by, featured_image, is_active
async function updateHitchTrailEntity(entityId, updateData) {
    const response = await fetch(`https://app.base44.com/api/apps/688347ad96c03b454b3e55db/entities/HitchTrail/${entityId}`, {
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