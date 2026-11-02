const BASE_URL = 'http://localhost:5001';

const runTests = async () => {
  console.log('🧪 Starting End-to-End API Test Suite for Tech-Fest 2026...\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition, name, details = '') => {
    if (condition) {
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${name} ${details}`);
      failed++;
    }
  };

  try {
    // 1. Health Check
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    const healthJson = await healthRes.json();
    assert(healthRes.status === 200 && healthJson.status === 'ok', 'GET /api/health returns status ok');

    // 2. Fetch seeded events
    const eventsRes = await fetch(`${BASE_URL}/api/events`);
    const eventsJson = await eventsRes.json();
    assert(eventsRes.status === 200 && eventsJson.count >= 8, `GET /api/events returns all events (found ${eventsJson.count})`);
    const firstEventId = eventsJson.data[0]._id;

    // 3. Login Student
    const studentLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student@techfest2026.com', password: 'Student@2026' }),
    });
    const studentLoginJson = await studentLoginRes.json();
    const studentToken = studentLoginJson.data?.token;
    assert(studentLoginRes.status === 200 && studentToken, 'POST /api/auth/login (Student) returns valid JWT token');

    // 4. Login Admin
    const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@techfest2026.com', password: 'Admin@2026' }),
    });
    const adminLoginJson = await adminLoginRes.json();
    const adminToken = adminLoginJson.data?.token;
    assert(adminLoginRes.status === 200 && adminLoginJson.data?.role === 'admin' && adminToken, 'POST /api/auth/login (Admin) verifies admin role and returns token');

    // 5. Invalid Login Rejection
    const invalidLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student@techfest2026.com', password: 'WrongPassword!' }),
    });
    assert(invalidLoginRes.status === 401, 'POST /api/auth/login rejects invalid credentials with 401');

    // 6. User Registration
    const newEmail = `innovator_${Date.now()}@college.edu`;
    const registerRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Jordan Lee',
        email: newEmail,
        password: 'Password@2026',
        college: 'Apex Engineering Institute',
        phone: '+91 91234 56789',
      }),
    });
    const registerJson = await registerRes.json();
    const newStudentToken = registerJson.data?.token;
    assert(registerRes.status === 201 && newStudentToken, `POST /api/auth/register creates new user with token (${newEmail})`);

    // 7. Verify /api/auth/me (Protected Route)
    const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${newStudentToken}` },
    });
    const meJson = await meRes.json();
    assert(meRes.status === 200 && meJson.data.email === newEmail, 'GET /api/auth/me returns authenticated user details');

    // 8. Event CRUD - Admin Creates New Event
    const createEventRes = await fetch(`${BASE_URL}/api/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        title: 'Quantum Computing Frontiers 2026',
        category: 'Workshop',
        description: 'Deep dive into qubits, quantum entanglement, and IBM Qiskit algorithms.',
        shortDescription: 'Hands-on quantum algorithm development workshop.',
        date: 'March 16, 2026',
        time: '02:00 PM - 05:00 PM',
        venue: 'Quantum Research Wing, Room 401',
        capacity: 45,
        prizePool: '₹25,000 in Quantum Cloud Credits',
      }),
    });
    const createEventJson = await createEventRes.json();
    assert(createEventRes.status === 201 && createEventJson.data._id, 'POST /api/events (Admin) creates new event');
    const createdEventId = createEventJson.data._id;

    // 9. Event CRUD - Student Forbidden from Creating Event (RBAC Check)
    const forbiddenCreateRes = await fetch(`${BASE_URL}/api/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${newStudentToken}`,
      },
      body: JSON.stringify({
        title: 'Unauthorized Event',
        category: 'Hackathon',
      }),
    });
    assert(forbiddenCreateRes.status === 403, 'POST /api/events rejects non-admin users with 403 Forbidden');

    // 10. Event CRUD - Admin Updates Event
    const updateEventRes = await fetch(`${BASE_URL}/api/events/${createdEventId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        capacity: 60,
        prizePool: '₹35,000 in Quantum Cloud Credits',
      }),
    });
    const updateEventJson = await updateEventRes.json();
    assert(updateEventRes.status === 200 && updateEventJson.data.capacity === 60, 'PUT /api/events/:id (Admin) updates event details');

    // 11. Event Registration - Student registers for event
    const regRes = await fetch(`${BASE_URL}/api/registrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${newStudentToken}`,
      },
      body: JSON.stringify({
        eventId: createdEventId,
        teamName: 'Qubit Pioneers',
        teamMembers: [
          { name: 'Jordan Lee', email: newEmail, college: 'Apex Engineering Institute' },
        ],
      }),
    });
    const regJson = await regRes.json();
    assert(regRes.status === 201 && regJson.data.ticketCode, `POST /api/registrations registers student with ticket ${regJson.data?.ticketCode}`);
    const registrationId = regJson.data?._id;

    // 12. Student views my registrations
    const myRegRes = await fetch(`${BASE_URL}/api/registrations/my`, {
      headers: { Authorization: `Bearer ${newStudentToken}` },
    });
    const myRegJson = await myRegRes.json();
    assert(myRegRes.status === 200 && myRegJson.data.length >= 1, 'GET /api/registrations/my lists registered events');

    // 13. Admin views all registrations
    const allRegRes = await fetch(`${BASE_URL}/api/registrations`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const allRegJson = await allRegRes.json();
    assert(allRegRes.status === 200 && allRegJson.data.length >= 2, `GET /api/registrations (Admin) lists all registrations (count: ${allRegJson.count})`);

    // 14. Student cancels registration
    const cancelRes = await fetch(`${BASE_URL}/api/registrations/${registrationId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${newStudentToken}` },
    });
    assert(cancelRes.status === 200, 'DELETE /api/registrations/:id cancels registration successfully');

    // 15. Event CRUD - Admin Deletes Event
    const deleteEventRes = await fetch(`${BASE_URL}/api/events/${createdEventId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(deleteEventRes.status === 200, 'DELETE /api/events/:id (Admin) deletes event successfully');

    // 16. Verify Deleted Event returns 404
    const getDeletedRes = await fetch(`${BASE_URL}/api/events/${createdEventId}`);
    assert(getDeletedRes.status === 404, 'GET /api/events/:id returns 404 for deleted event');

    console.log(`\n========================================`);
    console.log(`🏁 Test Summary: ${passed} Passed, ${failed} Failed`);
    console.log(`========================================\n`);

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error('Fatal test error:', err);
    process.exit(1);
  }
};

runTests();
