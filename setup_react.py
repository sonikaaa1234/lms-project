import os
import subprocess
import shutil

def create_react_build():
    """Create a minimal React build for Django to serve"""
    
    # Create build directory
    build_dir = os.path.join(os.getcwd(), 'frontend', 'build')
    static_dir = os.path.join(build_dir, 'static', 'js')
    
    os.makedirs(static_dir, exist_ok=True)
    
    # Create a simple bundle.js with all React components
    bundle_content = """
// Simple React bundle for LMS
// This is a minimal implementation for demonstration

// React components and routing would be compiled here
// For now, we'll create a simple implementation

console.log('LMS React Frontend Loaded');

// Simple routing implementation
window.LMS = {
    init: function() {
        console.log('LMS initialized');
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.LMS.init();
});
"""
    
    bundle_path = os.path.join(static_dir, 'bundle.js')
    with open(bundle_path, 'w') as f:
        f.write(bundle_content)
    
    print(f"React build created at {build_dir}")
    return build_dir

if __name__ == "__main__":
    create_react_build()
