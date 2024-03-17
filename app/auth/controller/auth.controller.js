const { AUTH_MODEL } = require("../model/auth.model");
const bcrypt = require("bcrypt");

const stripe = require("stripe")("");

/*For access dotenv file*/
const dotenv = require("dotenv");
dotenv.config();

const auth = {};

/**
 * REGISTRATION API
 */
auth.register = async (req, res, next) => {
  try {
    const data = req.body;

    const isExist = await AUTH_MODEL.findOne({ email: data.email });
    if (isExist) {
      res.status(400).send({
        success: false,
        message: "Account already exist with this email",
      });
    } else {
      const hash = await bcrypt.hash(
        data.password,
        parseInt(process.env.SOLT_ROUND)
      );
      data.password = hash;

      const customer = await stripe.customers.create({
        name: data.username,
        email: data.email,
      });

      data.customerId = customer.id;

      const saveData = await AUTH_MODEL.create(data);
      const userData = await AUTH_MODEL.findOne({ _id: saveData._id }).select(
        "-otp"
      );
      if (saveData) {
        res.status(200).send({
          success: true,
          message: "Account created successfully",
          data: userData,
        });
      } else {
        res.status(400).send({
          success: false,
          message: "Account not created",
        });
      }
    }
  } catch (error) {
    console.log("error", error.message);
  }
};

auth.addCard = async (req, res, next) => {
  try {
    const {
      Customer_Id,
      Card_Name,
      Card_ExpYear,
      Card_ExpMonth,
      Card_Number,
      Card_CVC,
    } = req.body;

    const card_token = await stripe.tokens.create({
      card: {
        name: Card_Name,
        number: Card_Number,
        exp_month: Card_ExpMonth,
        exp_year: Card_ExpYear,
        cvc: Card_CVC,
      },
    });

    const card = await stripe.customers.createSource(Customer_Id, {
      source: `${card_token.id}`,
    });

    if (card) {
      res.status(200).send({
        success: true,
        message: "Card created successfully",
        data: userData,
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Card not created",
        data: userData,
      });
    }
  } catch (error) {
    console.log("error", error);
  }
};

auth.createCharges = async (req, res, next) => {
  try {
    const { customer_Id, card_Id, amount } = req.body;

    const createCharge = await stripe.charges.create({
      amount: amount * 100,
      currency: "inr",
      card: card_Id,
      customer: customer_Id,
    });

    if (createCharge) {
      res.status(200).send({
        success: true,
        message: "Payment done successfully",
        data: createCharge,
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Payment not done",
        data: userData,
      });
    }
  } catch (error) {
    console.log("error", error);
  }
};
module.exports = auth;
