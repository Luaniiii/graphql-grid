const {render, useEffect, useState, createElement} = wp.element;

function PostsGrid({postsToShow}) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
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
        }`;

                const res = await fetch(lpgSettings.graphqlEndpoint, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        query,
                        variables: {
                            count: postsToShow,
                            excludeIds: lpgSettings.currentPostId ? [lpgSettings.currentPostId] : []
                        }
                    }),
                });

                const json = await res.json();
                setPosts(json.data?.posts?.nodes || []);
            } catch (err) {
                console.error('Frontend GraphQL fetch error:', err);
                setPosts([]);
            }
        }

        fetchPosts();
    }, [postsToShow]);

    if (!posts.length) return null;

    return createElement(
        'div',
        {className: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'},
        posts.map(post =>
            createElement(
                'div',
                {
                    key: post.id,
                    className: 'bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col'
                },
                post.featuredImage?.node?.sourceUrl &&
                createElement('img', {
                    src: post.featuredImage.node.sourceUrl,
                    alt: post.title,
                    className: 'w-full h-48 object-cover'
                }),
                createElement(
                    'div',
                    {className: 'p-4'},
                    createElement(
                        'h3',
                        {className: 'text-lg font-medium'},
                        createElement('a', {
                            href: post.link,
                            className: 'hover:text-blue-600',
                            dangerouslySetInnerHTML: {__html: post.title}
                        })
                    )
                )
            )
        )
    );
}

document.querySelectorAll('.lpg-wrapper').forEach(wrapper => {
    const postsToShow = parseInt(wrapper.dataset.postsToShow) || 4;
    render(createElement(PostsGrid, {postsToShow}), wrapper);
});
