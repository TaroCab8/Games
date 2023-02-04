import { DIRECTIONS, OBJECT_TYPE} from "./setup.js";

//primitive random movement

export function randomMovement(position, direction, objectExist) {
    let dir = direction;
    let nextMovePos = position + dir.movement;
    //Create an array form the directions objects keys
    const keys = Object.keys(DIRECTIONS);

    while(objectExist(nextMovePos, OBJECT_TYPE.WALL) || objectExist(nextMovePos, OBJECT_TYPE.GHOST)) {
        //get a random key from that array
        const key = keys[Math.floor(Math.random() * keys.length)];
        // set the new direction
        dir = DIRECTIONS[key];
        //Set the next move
        nextMovePos = position + dir.movement;
    }
    return {nextMovePos, direction: dir};
}