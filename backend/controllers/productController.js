const Product=require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchasynError=require("../middlewares/catchasynError");
const ApiFeature = require("../utils/apifeatures");


// create product  -- admin
exports.createProduct= catchasynError(async (req,res,next)=>{

  req.body.user = req.user.id;
    const products= await Product.create(req.body);

    res.status(201).json({
        success:true,
        products
    })
}
);
// all product
exports.getAllProducts= catchasynError( async (req,res,next)=>
{
   const resultpage=5;
    const countProduct=await Product.countDocuments();
  const apifeature=new ApiFeature(Product.find(),req.query).search().pagination(resultpage);
    const product= await apifeature.query;
    res.status(200).json({ 
        success:true,
        product
    })
}
);

// product details single
exports.getProductDetails= catchasynError(async(req,res,next)=>{
   let product= await Product.findById(req.params.id);

  if(!product)
  {
    return next(new ErrorHandler("Product Not Found",404));
  }
  res.status(200).json({
    success:true,
    product,
    countProduct
   })
});

// update product
exports.updateProducts= catchasynError( async(req,res,next)=>{
  let product= await Product.findById(req.params.id);

  if(!product)
  {
    return res.status(500).json({
        success:false,
        message:"Product Not Found"
    })
  }
  product=await Product.findByIdAndUpdate(req.params.id,req.body,{
   new:true,
   runValidators:true,
   useFindAndModify:false

  });
   res.status(200).json({
    success:true,
    product
   })
});


// delete product
exports.deleteProducts= catchasynError (async(req,res,next)=>{
    let product= await Product.findById(req.params.id);
  
    if(!product)
    {
      return res.status(500).json({
          success:false,
          message:"Product Not Found"
      })
    }
    await product.remove();
     res.status(200).json({
      success:true,
      message:"Product remove successfully"
     })
  });

  
// Create New Review or Update the review
exports.createProductReview = catchasynError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.NumOfReview = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get All Reviews of a product
exports.getProductReviews = catchasynError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Review
exports.deleteReview = catchasynError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const NumofReview = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      NumofReview,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});