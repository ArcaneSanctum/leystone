const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getArrayDifference(fromArray, toArray) {
    const diff = {
        added: [],
        removed: []
    };

    console.log('FROM ARRAY', fromArray);

    for (let i = 0; i < Math.max(fromArray.length, toArray.length); i++) {
        if (i < fromArray.length && !toArray.includes(fromArray[i])) diff.removed.push(fromArray[i]);
        if (i < toArray.length && !fromArray.includes(toArray[i]))   diff.added.push(toArray[i]); 
    }

    return diff;
}

module.exports = {
    sleep,
    getArrayDifference
}