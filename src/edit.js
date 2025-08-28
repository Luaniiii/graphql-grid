import {PanelBody, RangeControl} from '@wordpress/components';
import {useState, useEffect} from '@wordpress/element';
import {InspectorControls, useBlockProps} from '@wordpress/block-editor';
import {useSelect} from '@wordpress/data';

export default function Edit({attributes, setAttributes}) {
    const blockProps = useBlockProps();
    const [posts, setPosts] = useState([]);
    const postsToShow = attributes.postsToShow || 4;

    const currentPostId = useSelect(select => select('core/editor').getCurrentPostId());

    useEffect(() => {
        if (currentPostId && attributes.currentPostId !== currentPostId) {
            setAttributes({currentPostId});
        }

        async function fetchPosts() {
            try {
                const query = `
query GetLatestPosts($count: Int!, $excludeIds: [ID!]!) {
  posts(first: $count, where: { notIn: $excludeIds }) {
    nodes {
      id
      title
      link
      featuredImage {
        node { sourceUrl(size: THUMBNAIL) }
      }
    }
  }
}
`;

                const variables = {
                    count: postsToShow, excludeIds: currentPostId ? [currentPostId] : []
                };

                const res = await fetch(`${lpgSettings.graphqlEndpoint}`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({query, variables})
                });

                const json = await res.json();
                setPosts(json.data?.posts?.nodes || []);
            } catch (err) {
                console.error(err);
                setPosts([]);
            }
        }

        fetchPosts();
    }, [postsToShow, currentPostId]);

    return (<div {...blockProps}>
        <InspectorControls>
            <PanelBody title="Latest Posts Grid Settings">
                <RangeControl
                    label="Number of posts to show"
                    value={postsToShow}
                    onChange={value => setAttributes({postsToShow: value})}
                    min={1}
                    max={12}
                />
            </PanelBody>
        </InspectorControls>

        <div className="lpg-wrapper-editor grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {posts.length === 0 ? (<p>No posts to display</p>) : (posts.map(post => (<div
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 p-4 flex flex-col"
                key={post.id}
            >
                {post.featuredImage?.node?.sourceUrl && (<img
                    src={post.featuredImage.node.sourceUrl}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                />)}
                <h3 className="text-lg font-semibold text-gray-900">
                    <a
                        href={post.link}
                        className="hover:text-blue-600"
                        dangerouslySetInnerHTML={{__html: post.title}}
                    />
                </h3>
            </div>)))}
        </div>
    </div>);
}
