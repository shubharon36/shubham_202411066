import { NextResponse } from 'next/server';
import { faker } from '@faker-js/faker';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (email && password) {
    const user = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email,
      role: 'customer' as const,
    };
    return NextResponse.json({ user });
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
