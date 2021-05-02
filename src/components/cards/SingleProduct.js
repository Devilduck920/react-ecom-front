import React, { Fragment, useState } from "react";
import { Card, Tabs, Tooltip } from "antd";
import { Link, useHistory } from "react-router-dom";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Laptop from "../../images/laptop.png";
import ProductListItems from "./ProductIListItems";
import StarRating from "react-star-ratings";
import RatingModal from "../modal/RatingModal";
import { showAverage } from "../../functions/rating";

import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { addToWishlist } from "../../functions/user";
import { toast } from "react-toastify";
const { TabPane } = Tabs;

const SingleProduct = ({ product, onStarClick, star }) => {
	const [tooltip, setTooltip] = useState("Click to add");

	const dispatch = useDispatch();

	let history = useHistory();

	const { user, cart } = useSelector((state) => ({ ...state }));

	const { title, images, description, _id } = product;

	const handleAddToCart = () => {
		let cart = [];
		if (typeof window !== "undefined") {
			if (localStorage.getItem("cart")) {
				cart = JSON.parse(localStorage.getItem("cart"));
			}

			cart.push({
				...product,
				count: 1,
			});
			let unique = _.uniqWith(cart, _.isEqual);
			console.log("unique", unique);

			localStorage.setItem("cart", JSON.stringify(unique));
			setTooltip("Added");

			dispatch({
				type: "ADD_TO_CART",
				payload: unique,
			});

			dispatch({
				type: "SET_VISIBLE",
				payload: true,
			});
		}
	};

	const handleAddToWishlist = (e) => {
		e.preventDefault();
		addToWishlist(product._id, user.token).then((res) => {
			console.log("ADDED TO WISHLIST", res.data);
			toast.success("Added to wishlist");
			history.push("/user/wishlist");
		});
	};

	return (
		<>
			<div className="col-md-7">
				{images && images.length ? (
					<Carousel showArrows={true} autoPlay infiniteLoop>
						{images && images.map((i) => <img src={i.url} key={i.public_id} />)}
					</Carousel>
				) : (
					<Card
						cover={
							<img
								src={images && images.length ? images[0].url : Laptop}
								className="mb-3 card-image"
							/>
						}
					></Card>
				)}
				<Tabs type="card">
					<TabPane tab="description" key="1">
						{description && description}
					</TabPane>
					<TabPane tab="more" key="2">
						Call us on xxx-xxx-xxxx
					</TabPane>
				</Tabs>
			</div>

			<div className="col-md-5">
				<h1 className="bg-info p-3">{title}</h1>

				{product && product.ratings && product.ratings.length > 0 ? (
					showAverage(product)
				) : (
					<div className="text-center pt-1 pb-3">No rating yet</div>
				)}

				<Card
					actions={[
						<Tooltip placement="top" title={tooltip}>
							<a onClick={handleAddToCart} disabled={product.quantity < 1}>
								<ShoppingCartOutlined
									className={
										product.quantity < 1 ? "text-danger" : "text-success	"
									}
								/>{" "}
								<br />
								{product.quantity < 1 ? "Out of Stock" : "Add to Cart"}
							</a>
						</Tooltip>,

						<Fragment>
							<a onClick={handleAddToWishlist}>
								<HeartOutlined className="text-info" />
							</a>
							<br />
							Add to Wishlist
						</Fragment>,
						<RatingModal>
							<StarRating
								name={_id}
								numberOfStars={5}
								rating={star}
								changeRating={onStarClick}
								isSelectable={true}
								starRatedColor="red"
							/>
						</RatingModal>,
					]}
				>
					<ProductListItems product={product} />
				</Card>
			</div>
		</>
	);
};

export default SingleProduct;
