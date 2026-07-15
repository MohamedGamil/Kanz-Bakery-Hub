import { Router, type IRouter } from "express";
import healthRouter from "./health";
import categoriesRouter from "./categories";
import productsRouter from "./products";
import reviewsRouter from "./reviews";
import cateringRouter from "./catering";
import catalogRouter from "./catalog";
import stripeRouter from "./stripe";

const router: IRouter = Router();

router.use(healthRouter);
router.use(categoriesRouter);
router.use(productsRouter);
router.use(reviewsRouter);
router.use(cateringRouter);
router.use(catalogRouter);
router.use(stripeRouter);

export default router;
