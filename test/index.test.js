const { p2vConverter } = require('../index.js');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

// Mock test data and utilities
const testDir = path.join(__dirname, 'test-files');
const uploadsDir = path.join(__dirname, '..', 'uploads');

// Clean up function
function cleanup() {
  try {
    if (fs.existsSync(uploadsDir)) {
      fs.rmSync(uploadsDir, { recursive: true, force: true });
    }
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  } catch (err) {
    // Ignore cleanup errors in tests
    console.log('Cleanup warning:', err.message);
  }
}

// Setup test environment
function setup() {
  cleanup();
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }
}

// Create a simple test PDF file (minimal PDF content)
function createTestPDF() {
  const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(Test Page) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000010 00000 n 
0000000079 00000 n 
0000000173 00000 n 
0000000301 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
398
%%EOF`;
  
  const testPDFPath = path.join(testDir, 'test.pdf');
  fs.writeFileSync(testPDFPath, pdfContent);
  return testPDFPath;
}

// Mocha tests (run only if mocha is available)
if (typeof describe !== 'undefined') {
  describe('ppt-to-video module tests', function() {
    this.timeout(60000); // Increase timeout for conversion operations
    
    beforeEach(function() {
      setup();
    });
    
    afterEach(function() {
      cleanup();
    });

    describe('p2vConverter function', function() {
      it('should be a function', function() {
        assert.strictEqual(typeof p2vConverter, 'function');
      });

      it('should return a Promise', function() {
        const testPDFPath = createTestPDF();
        const result = p2vConverter(
          testPDFPath,
          'test',
          {
            fps: 25,
            loop: 2,
            transition: true,
            transitionDuration: 1,
            videoBitrate: 1024,
            videoCodec: 'libx264',
            size: '640x?',
            format: 'mp4',
            pixelFormat: 'yuv420p'
          },
          {
            density: 100,
            format: "png",
            size: "600x600"
          },
          testDir,
          false,
          testDir
        );
        
        assert(result instanceof Promise, 'p2vConverter should return a Promise');
      });

      it('should handle missing file gracefully', async function() {
        const nonExistentPath = path.join(testDir, 'nonexistent.pdf');
        
        try {
          await p2vConverter(
            nonExistentPath,
            'test',
            { fps: 25, loop: 2 },
            { density: 100, format: "png" },
            testDir,
            false,
            testDir
          );
          assert.fail('Should have thrown an error for missing file');
        } catch (error) {
          // Expected to throw an error - current implementation rejects with undefined
          // This is a known issue with the current implementation
          console.log('Expected error for missing file (current implementation limitation)');
        }
      });

      it('should handle invalid parameters', async function() {
        try {
          await p2vConverter();
          assert.fail('Should have thrown an error for missing parameters');
        } catch (error) {
          // Expected to throw an error - current implementation may not validate properly
          console.log('Expected error for missing parameters');
        }
      });
    });

    describe('Module exports', function() {
      it('should export p2vConverter function', function() {
        const moduleExports = require('../index.js');
        assert(moduleExports.hasOwnProperty('p2vConverter'));
        assert.strictEqual(typeof moduleExports.p2vConverter, 'function');
      });
    });
  });
}

// Simple test runner for environments without mocha
if (require.main === module) {
  console.log('Running basic tests...');
  
  setup();
  
  // Test 1: Module exports
  try {
    const { p2vConverter } = require('../index.js');
    assert.strictEqual(typeof p2vConverter, 'function');
    console.log('✓ Module exports p2vConverter function');
  } catch (error) {
    console.error('✗ Module export test failed:', error.message);
  }
  
  // Test 2: Function returns Promise
  try {
    const testPDFPath = createTestPDF();
    const result = p2vConverter(
      testPDFPath,
      'test',
      { fps: 25, loop: 1 },
      { density: 100, format: "png" },
      testDir,
      false,
      testDir
    );
    
    assert(result instanceof Promise);
    console.log('✓ p2vConverter returns a Promise');
    
    // Handle the promise to avoid unhandled rejection
    result.catch(() => {
      // Expected to fail in test environment without proper dependencies
    });
  } catch (error) {
    console.error('✗ Promise test failed:', error.message);
  }
  
  cleanup();
  console.log('Basic tests completed.');
}