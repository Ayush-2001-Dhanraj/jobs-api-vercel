const { NotBeforeError } = require("jsonwebtoken");
const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userID }).sort("createdAt");
  res.status(StatusCodes.OK).json({ count: jobs.length, jobs });
};

const getJob = async (req, res) => {
  const job = await Job.findOne({
    createdBy: req.user.userID,
    _id: req.params.id,
  });
  if (!job)
    throw new NotBeforeError(
      `User with id ${req.params.id} and created by ${req.user.userID} doesn't exists`
    );
  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userID;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const { company, position } = req.body;

  if (!company || !position)
    throw new BadRequestError("Please provide company and position");

  const job = await Job.findOneAndUpdate(
    {
      _id: req.params.id,
      createdBy: req.user.userID,
    },
    req.body,
    { new: true, runValidators: true }
  );

  if (!job)
    throw new NotBeforeError(
      `User with id ${req.params.id} and created by ${req.user.userID} doesn't exists`
    );

  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const job = await Job.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user.userID,
  });

  if (!job)
    throw new NotBeforeError(
      `User with id ${req.params.id} and created by ${req.user.userID} doesn't exists`
    );

  res.status(StatusCodes.OK).send();
};

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };
