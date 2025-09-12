import { PrismaClient } from '@prisma/client';
import { createClient } from 'redis';

const prisma = new PrismaClient();

async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing PostgreSQL connection...');
    await prisma.$connect();
    console.log('✅ PostgreSQL connection successful');
    
    // Test a simple query
    const userCount = await prisma.user.count();
    console.log(`📊 Found ${userCount} users in database`);
    
    return true;
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

async function testRedisConnection() {
  try {
    console.log('🔍 Testing Redis connection...');
    const redis = createClient({
      url: process.env.REDIS_URL
    });
    
    await redis.connect();
    
    // Test set and get
    await redis.set('test-key', 'test-value');
    const value = await redis.get('test-key');
    
    if (value === 'test-value') {
      console.log('✅ Redis connection successful');
      await redis.del('test-key'); // Cleanup
      await redis.disconnect();
      return true;
    } else {
      throw new Error('Redis set/get test failed');
    }
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
    return false;
  }
}

async function testEnvironmentVariables() {
  console.log('🔍 Testing environment variables...');
  
  const requiredVars = [
    'DATABASE_URL',
    'REDIS_URL',
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'CLERK_SECRET_KEY',
    'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
    'RESEND_API_KEY'
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length === 0) {
    console.log('✅ All required environment variables are set');
    return true;
  } else {
    console.error('❌ Missing environment variables:', missingVars);
    return false;
  }
}

async function testGoogleMapsAPI() {
  try {
    console.log('🔍 Testing Google Maps API...');
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      throw new Error('Google Maps API key not found');
    }
    
    // Test with a simple geocoding request
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=Buenos Aires, Argentina&key=${apiKey}`
    );
    
    const data = await response.json();
    
    if (data.status === 'OK') {
      console.log('✅ Google Maps API connection successful');
      return true;
    } else {
      throw new Error(`Google Maps API error: ${data.status}`);
    }
  } catch (error) {
    console.error('❌ Google Maps API test failed:', error);
    return false;
  }
}

async function testResendAPI() {
  try {
    console.log('🔍 Testing Resend API...');
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey) {
      throw new Error('Resend API key not found');
    }
    
    // Test API key validity by checking domains
    const response = await fetch('https://api.resend.com/domains', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      console.log('✅ Resend API connection successful');
      return true;
    } else {
      throw new Error(`Resend API error: ${response.status}`);
    }
  } catch (error) {
    console.error('❌ Resend API test failed:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting connection tests...\n');
  
  const tests = [
    { name: 'Environment Variables', fn: testEnvironmentVariables },
    { name: 'PostgreSQL Database', fn: testDatabaseConnection },
    { name: 'Redis Cache', fn: testRedisConnection },
    { name: 'Google Maps API', fn: testGoogleMapsAPI },
    { name: 'Resend Email API', fn: testResendAPI }
  ];
  
  const results = [];
  
  for (const test of tests) {
    console.log(`\n--- ${test.name} ---`);
    const result = await test.fn();
    results.push({ name: test.name, success: result });
  }
  
  console.log('\n📋 SUMMARY');
  console.log('='.repeat(50));
  
  let allPassed = true;
  for (const result of results) {
    const status = result.success ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${result.name}`);
    if (!result.success) allPassed = false;
  }
  
  console.log('='.repeat(50));
  
  if (allPassed) {
    console.log('🎉 All tests passed! Your setup is ready.');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed. Please check your configuration.');
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

main().catch((error) => {
  console.error('Test suite failed:', error);
  process.exit(1);
});