import mongoose from 'mongoose';
import dns from 'dns';

const connectDB = async () => {
  // Apply DNS server override for Atlas SRV resolution
  // Google Public DNS is included for reliable SRV lookups on restricted networks
  try {
    const dnsServers = ['8.8.8.8', '8.8.4.4'];
    if (process.env.DNS_SERVER) {
      dnsServers.unshift(process.env.DNS_SERVER);
    }
    dns.setServers(dnsServers);
    console.log(`[Database] DNS resolvers configured: ${dnsServers.join(', ')}`);
  } catch (dnsErr) {
    console.error(`[Database] Failed to configure DNS servers: ${dnsErr.message}`);
  }

  const primaryUri = process.env.MONGODB_URI;
  const fallbackUri = 'mongodb://127.0.0.1:27017/preppilot';
  const maxRetries = 3;
  const retryInterval = 3000; // 3 seconds

  // Register event listeners on the mongoose connection lifecycle
  mongoose.connection.on('connecting', () => {
    console.log('[Database] Connection attempt initialized...');
  });

  mongoose.connection.on('connected', () => {
    console.log(`[Database] MongoDB Connected: ${mongoose.connection.host}`);
  });

  mongoose.connection.on('error', (err) => {
    console.error(`[Database] Runtime connection error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[Database] Connection status changed: Disconnected');
  });

  // Helper function to manage connection attempts
  const attemptConnect = async (uri, isFallback = false) => {
    const connType = isFallback ? 'Local Fallback' : 'Primary URI';
    // Hide username/password credentials in logs
    const maskedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
    console.log(`[Database] Attempting connection to ${connType}: ${maskedUri}`);

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await mongoose.connect(uri, {
          serverSelectionTimeoutMS: 5000, // Fail fast if cannot connect within 5s
        });
        return true; // Connection succeeded
      } catch (error) {
        console.error(`[Database] [Attempt ${attempt}/${maxRetries}] Failed: ${error.message}`);
        
        // Identify specific DNS errors
        if (error.message.includes('querySrv') || error.message.includes('ENOTFOUND')) {
          console.warn(`[Database] DNS / SRV resolution failed. This is likely a network restriction or invalid DNS configuration.`);
        }
        
        if (attempt < maxRetries) {
          console.log(`[Database] Waiting ${retryInterval / 1000}s before next attempt...`);
          await new Promise((resolve) => setTimeout(resolve, retryInterval));
        }
      }
    }
    return false; // Connection failed after all retries
  };

  // 1. Attempt primary MongoDB URI connection
  if (primaryUri) {
    const success = await attemptConnect(primaryUri, false);
    if (success) return;
    console.warn('[Database] Primary database connection failed all attempts.');
  } else {
    console.warn('[Database] Primary MONGODB_URI is not set in environment configurations.');
  }

  // 2. Attempt fallback connection to local MongoDB
  console.log('[Database] Initiating local fallback database sequence...');
  const fallbackSuccess = await attemptConnect(fallbackUri, true);

  if (!fallbackSuccess) {
    console.error('\n================================================================');
    console.error('[Database] FATAL CONNECTIVITY ERROR:');
    console.error('  Failed to establish connection to:');
    console.error(`  - Primary: ${primaryUri ? primaryUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@') : 'Not Set'}`);
    console.error(`  - Fallback: ${fallbackUri}`);
    console.error('\n  Possible Causes:');
    console.error('  1. Network blocks SRV queries (common on educational/corporate Wi-Fi).');
    console.error('  2. IP address is not whitelisted in MongoDB Atlas Network Access settings.');
    console.error('  3. Local MongoDB server is not running on port 27017.');
    console.error('================================================================\n');
    
    // Server continues running without DB — API will return errors for DB-dependent routes
    console.warn('[Database] Server will continue running. DB-dependent routes will fail until connection is restored.');
  }
};

export default connectDB;
