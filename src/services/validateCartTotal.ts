import { ProductModel } from "../models/Product";
import { additionalItemsPrices, deliveryFees } from '../utils/itemsPrices';

interface CartItem {
  _id: string;
  quantity: number;
  selectedAdditions: string[];
}

export const validateCartTotal = async (
  cartItems: any,
  frontendTotal: number,
  delivery: number
) => {
  let calculatedTotal = 0;

  for (const item of cartItems) {
    // Fetch product from DB
    const product = await ProductModel.findById(item._id);
    if (!product) throw new Error(`Invalid product ID: ${item._id}`);

    // Calculate total for additions using backend hardcoded prices
    const additionsTotal = item.selectedAdditions?.reduce((sum: number, addId: any) => {
      const price = additionalItemsPrices[addId.name];
      if (!price) throw new Error(`Invalid addition ID: ${addId}`);
      return sum + price;
    }, 0) || 0;

    const itemTotal = (product.price + additionsTotal) * item.quantity;
    calculatedTotal += itemTotal;
  }
  let deliveryFee = 0;
  // Add delivery fee
  if(delivery > 0){
    deliveryFee = deliveryFees["standard"];
  }

  if (deliveryFee === undefined) throw new Error(`Invalid delivery price: ${deliveryFee}`);
    calculatedTotal += deliveryFee;

  // Compare with frontend total
  if (calculatedTotal !== frontendTotal) {
    console.log(`Cart total mismatch. Calculated: ${calculatedTotal}, Frontend: ${frontendTotal}`);
    return false ;
  }

  return true; // total is correct
};