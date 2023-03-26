const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    //console.log('some update action performed');
    // res.status(204).json({
    //   status: 'success',
    //   data: 'some delete action performed',
    // });
    // console.log(req.params.id);
    const doc = await Model.findByIdAndDelete(req.params.id);
    //console.log(tour);
    if (!doc) {
      return next(new AppError('No Document found with that Id', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

// exports.deleteTour = catchAsync(async (req, res, next) => {
//   //console.log('some update action performed');
//   // res.status(204).json({
//   //   status: 'success',
//   //   data: 'some delete action performed',
//   // });
//   console.log(req.params.id);
//   const tour = await Tour.findByIdAndDelete(req.params.id);
//   //console.log(tour);
//   if (!tour) {
//     return next(new AppError('No Tour found with that Id', 404));
//   }

//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    //console.log('some update action performed');

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError('No document found with that Id', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
    // res.send('done');
  });
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    //console.log(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that Id', 404));
    }
    // console.log(doc);
    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    //To allow for nested GET reviews
    let filter;
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    //Execute Query
    // console.log(features.query);
    const doc = await features.query;
    // const doc=await features.query.explain()
    //console.log(tours);
    res.status(200).json({
      status: 'success',
      result: doc.length,
      data: { doc },
    });
  });
