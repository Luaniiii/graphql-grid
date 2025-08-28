import {registerBlockType} from '@wordpress/blocks';
import Edit from './edit';
import './style.css';

registerBlockType('graphql-grid/latest-posts-grid', {
    edit: Edit,
    save: () => null,
});
