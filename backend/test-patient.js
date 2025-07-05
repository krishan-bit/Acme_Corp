const axios = require('axios');

async function testCreatePatient() {
    try {
        const patientData = {
            name: "Test Patient",
            age: 35,
            email: "test.patient@example.com",
            phone: "+1-555-123-4567",
            condition: "Obesity",
            status: "active"
        };

        console.log('🧪 Testing patient creation...');
        console.log('Data to send:', JSON.stringify(patientData, null, 2));

        const response = await axios.post('http://localhost:5000/api/patients', patientData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ Success! Patient created:');
        console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.log('❌ Error creating patient:');
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Error data:', error.response.data);
        } else {
            console.log('Error:', error.message);
        }
    }
}

testCreatePatient();
