const heapBefore = { total_heap_size: 9805824,
total_heap_size_executable: 3670016,
total_physical_size: 7276840,
total_available_size: 1490083832,
used_heap_size: 6052704,
heap_size_limit: 1501560832,
malloced_memory: 8192,
peak_malloced_memory: 1185792,
does_zap_garbage: 0 };

const heapAfter = { total_heap_size: 34758656,
total_heap_size_executable: 3670016,
total_physical_size: 31818056,
total_available_size: 1468240056,
used_heap_size: 30409672,
heap_size_limit: 1501560832,
malloced_memory: 8192,
peak_malloced_memory: 1185792,
does_zap_garbage: 0 };

const keys = Object.keys(heapBefore);
const diffObj = {};
const percentChange = {};
keys.forEach(key => {
    const diff = heapAfter[key] - heapBefore[key];
    diffObj[key] = diff/1000;

});
console.log(diffObj)