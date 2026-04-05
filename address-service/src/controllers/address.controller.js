import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Address } from "../models/address.model.js";
import { unsetOtherDefaults, findUserAddresses } from "../services/address.service.js";
import { sendAddressEvent } from "../kafka/producers/address.producer.js";
import { ADDRESS_EVENTS } from "../kafka/kafkaEvents.js";

export const createAddress = asyncHandler(async (req, res) => {
    const user_id = req.user.id;
    const { isDefault } = req.body;

    if (isDefault) {
        await unsetOtherDefaults(user_id);
    }

    const address = await Address.create({
        ...req.body,
        user_id
    });

    await sendAddressEvent(ADDRESS_EVENTS.ADDRESS_CREATED, address);

    res.status(201).json({ success: true, data: address });
});


export const getMyAddresses = asyncHandler(async (req, res) => {
    const addresses = await findUserAddresses(req.user.id);
    res.status(200).json({ success: true, data: addresses });
});


export const updateAddress = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;
    const { isDefault } = req.body;

    if (isDefault) {
        await unsetOtherDefaults(user_id);
    }

    const address = await Address.findOneAndUpdate(
        { _id: id, user_id },
        { $set: req.body },
        { new: true, runValidators: true }
    );

    if (!address) throw new ApiError(404, "Address not found");

    await sendAddressEvent(ADDRESS_EVENTS.ADDRESS_UPDATED, address);

    res.status(200).json({ success: true, data: address });
});


export const removeAddress = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;

    const address = await Address.findOneAndDelete({ _id: id, user_id });

    if (!address) throw new ApiError(404, "Address not found");

    await sendAddressEvent(ADDRESS_EVENTS.ADDRESS_DELETED, { id, user_id });

    res.status(200).json({ success: true, message: "Address deleted successfully" });
});


export const getAllUserAddresses = asyncHandler(async (req, res) => {
    const summary = await Address.aggregate([
        {
            $sort: { isDefault: -1, createdAt: -1 }
        },
        {
            $group: {
                _id: "$user_id",
                totalAddresses: { $sum: 1 },
                defaultAddress: { $first: "$$ROOT" } 
            }
        },
        {
            $project: {
                _id: 0,
                user_id: "$_id",
                totalAddresses: 1,
                name: "$defaultAddress.full_name",
                phone: "$defaultAddress.phone",
                city: "$defaultAddress.city",
                state: "$defaultAddress.state",
                pin_code: "$defaultAddress.pin_code",
                country: "$defaultAddress.country"
            }
        },
        { $sort: { name: 1 } }
    ]);

    res.status(200).json({
        success: true,
        data: summary
    });
});