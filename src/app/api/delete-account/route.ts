import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../(auth)/[...nextauth]';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function DELETE(request: NextRequest) {
  try {
    // Verify user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { email } = await request.json();

    // Verify the email matches the authenticated user
    if (email !== session.user.email) {
      return NextResponse.json(
        { error: 'Email does not match authenticated user' },
        { status: 403 }
      );
    }

    await connectDB();

    // Find and delete the user
    const deletedUser = await User.findOneAndDelete({ email });

    if (!deletedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }



    return NextResponse.json({
      message: 'Account and all associated data have been successfully deleted',
      deletedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}