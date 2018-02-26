const mySharedTemplate = require('../../views/layouts/main.hbs');
const dashboard = require('../../views/dashboard/dashboard.hbs');
//scss files
import css from '../scss/main.scss';
//js files
import $ from 'jquery'
require('bootstrap-sass');
import DeleteReq from "./delete_product.js";
import NavBar from "./navbar.js";
import Map from "./map.js";
import image from "./image_src.js";
import quantity_btn from "./partials/quantity_btn.js";
import category_btn from "./partials/category_btn.js"
import imagePreview from "./imagePreview.js"
