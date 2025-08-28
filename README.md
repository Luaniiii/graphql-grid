Gutenberg Block Tech
Custom Gutenberg block to display a latest posts grid using GraphQL, React, and Tailwind CSS.


Installation

Option 1: Upload via WordPress Admin
1. Zip the plugin folder graphql-grid.
2. Go to your WordPress Admin → Plugins → Add New → Upload Plugin.
3. Select the graphql-grid.zip file and click Install Now.
4. Activate the plugin.
5. Install and activate the WPGraphQL plugin (required).

Option 2: Manual Installation
1. Download the plugin folder graphql-grid.
2. Place it into your WordPress wp-content/plugins/ directory.
3. Activate the plugin from WordPress Admin → Plugins.
4. Install and activate the WPGraphQL plugin (required).  


Usage

1. Open the Gutenberg editor.  
2. Add the Latest Posts Grid block.  
3. In the block settings sidebar, choose how many posts to display (1–12).  
4. The block automatically excludes the current post so it doesn’t list itself.  
5. Publish or update the page/post to see the grid on the frontend.  

Notes

- Frontend and editor grid styling is built with Tailwind CSS.  
- Compiled assets are already included in `/build` → no need to run `npm install` for production use.  
- If WPGraphQL is not available, the block will show a fallback message.  


Requirements

- WordPress 6.0+  
- Gutenberg Editor  
- WPGraphQL plugin  


Author
Luan Boshnjaku
