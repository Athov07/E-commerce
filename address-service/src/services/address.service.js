import { Address } from "../models/address.model.js";

/**
 * Find all addresses belonging to a specific user
 */
export const findUserAddresses = async (user_id) => {
    return await Address.find({ user_id }).sort({ isDefault: -1, createdAt: -1 });
};

/**
 * If a new address is set as default, we must unset 'isDefault' 
 * for all other addresses belonging to that user.
 */
export const unsetOtherDefaults = async (user_id) => {
    await Address.updateMany(
        { user_id, isDefault: true },
        { $set: { isDefault: false } }
    );
};