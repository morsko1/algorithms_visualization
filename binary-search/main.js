const container = document.getElementById('container');

const arr = Array.from(new Array(20), (x, i) => i + 1);

let state = {
    step: 0,
    current: null,
    processed: [],
    start: 0,
    end: arr.length - 1,
    inProcess: false,
    found: null
};

function start (e) {
    e.preventDefault();
    if (state.inProcess) {
        return;
    }
    state = {
        step: 0,
        current: null,
        processed: [],
        start: 0,
        end: arr.length - 1,
        inProcess: true,
        found: null
    };
    let item = parseInt(e.target[0].value);
    binarySearchAsync(arr, item);
    return false;
}

async function binarySearchAsync (arr, item) {
    let middle;
    state.inProcess = true;
    const setPointer = () => new Promise((resolve) => {
        setTimeout(() => {
            middle = Math.floor((state.start + state.end) / 2);
            state.current = middle;
            console.log('setPointer');
            render();
            resolve();
        }, 1000);
    });

    const trimStart = () => new Promise((resolve) => {
        setTimeout(() => {
            state.start = middle + 1;
            render();
            resolve();
        }, 1000);
    });

    const trimEnd = () => new Promise((resolve) => {
        setTimeout(() => {
            state.end = middle - 1;
            render();
            resolve();
        }, 1000);
    });

    const checkItem = () => new Promise((resolve) => {
        setTimeout(async () => {
            if (item === arr[middle]) {
                console.log('found, index is: ', middle);
                console.log('iteration № ', state.step);
                state.inProcess = false;
                state.found = middle;
                render();
                resolve(arr[middle]);
            } else if (item < arr[middle]) {
                console.log('less');
                state.processed.push(middle);
                render();
                await trimEnd();
                resolve();
            } else if (item > arr[middle]) {
                console.log('bigger');
                state.processed.push(middle);
                render();
                await trimStart();
                resolve();
            }
            if (state.start > state.end) {
                state.inProcess = false;
                console.log('not found');
                console.log('iteration № ', state.step);
                render();
                resolve(undefined);
            }
        }, 1000);
    });

    const doStep = () => new Promise(async (resolve) => {
        state.step++;
        await setPointer();
        await checkItem();
        resolve();
    });

    render();

    while (state.inProcess) {
        await doStep();
    }
}

function render () {
    container.innerHTML = '';
    for (let i = 0; i < arr.length; i++) {
        const elem = document.createElement('div');
        elem.innerHTML = arr[i];
        elem.classList.add('item');
        if (i < state.start || i > state.end) {
            elem.classList.add('disabled');
        }
        if (i === state.current) {
            elem.classList.add('current');
        }
        if (state.processed.includes(i)) {
            elem.classList.add('processed');
        }
        
        if (i === state.found) {
            elem.classList.add('found');
        }

        container.appendChild(elem);
    }
}

render();
