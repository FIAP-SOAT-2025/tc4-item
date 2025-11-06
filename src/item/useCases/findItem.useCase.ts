import Item from "../entities/item.entity";
import ItemGatewayInterface from "../interfaces/itemGatewayInterface";

export default class FindItemUseCase {
 static async findById(id: string,  itemGateway: ItemGatewayInterface): Promise<Item | null> {
        const itemExists = await itemGateway.findByIdIfNotDeleted(id, false);
        return new Item(itemExists); 
    }
} 
