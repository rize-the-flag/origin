var obj = [
    { group: 1, name: 'a' },
    { group: 1, name: 'b' },
    { group: 2, name: 'c' },
];

var GroupByType = function (objectArray, field) {
    return objectArray.reduce(function (acc, item) {
        if (!acc[item[field]])
            acc[item[field]] = [];
        acc[item[field]].push(item);
        return acc;
    }, {});
};
console.log(GroupByType(obj, 'group'));
