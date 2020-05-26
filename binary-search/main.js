class BinarySearch {
    constructor(array) {
        this.array = array;
        this.container = document.getElementById('container');
        this.state = {
            step: 0,
            current: null,
            processed: [],
            start: 0,
            end: array.length - 1,
            inProcess: false,
            found: null
        };
        this.init();
    }

    start(e) {
        e.preventDefault();
        if (this.state.inProcess) {
            return;
        }
        this.state = {
            step: 0,
            current: null,
            processed: [],
            start: 0,
            end: this.array.length - 1,
            inProcess: true,
            found: null
        };
        const item = parseInt(e.target[0].value);
        this.binarySearchAsync(this.array, item);
        return false;
    }

    async binarySearchAsync(arr, item) {
        let middle;
        this.state.inProcess = true;
        const setPointer = () => new Promise((resolve) => {
            setTimeout(() => {
                middle = Math.floor((this.state.start + this.state.end) / 2);
                this.state.current = middle;
                console.log('setPointer');
                this.render();
                resolve();
            }, 1000);
        });

        const trimStart = () => new Promise((resolve) => {
            setTimeout(() => {
                this.state.start = middle + 1;
                this.render();
                resolve();
            }, 1000);
        });

        const trimEnd = () => new Promise((resolve) => {
            setTimeout(() => {
                this.state.end = middle - 1;
                this.render();
                resolve();
            }, 1000);
        });

        const checkItem = () => new Promise((resolve) => {
            setTimeout(async () => {
                if (item === this.array[middle]) {
                    console.log('found, index is: ', middle);
                    console.log('iteration № ', this.state.step);
                    this.state.inProcess = false;
                    this.state.found = middle;
                    this.render();
                    resolve(this.array[middle]);
                } else if (item < this.array[middle]) {
                    console.log('less');
                    this.state.processed.push(middle);
                    this.render();
                    await trimEnd();
                    resolve();
                } else if (item > this.array[middle]) {
                    console.log('bigger');
                    this.state.processed.push(middle);
                    this.render();
                    await trimStart();
                    resolve();
                }
                if (this.state.start > this.state.end) {
                    this.state.inProcess = false;
                    console.log('not found');
                    console.log('iteration № ', this.state.step);
                    this.render();
                    resolve(undefined);
                }
            }, 1000);
        });

        const doStep = () => new Promise(async (resolve) => {
            this.state.step++;
            await setPointer();
            await checkItem();
            resolve();
        });

        this.render();

        while (this.state.inProcess) {
            await doStep();
        }
    }

    render() {
        this.container.innerHTML = '';
        for (let i = 0; i < this.array.length; i++) {
            const elem = document.createElement('div');
            elem.innerHTML = this.array[i];
            elem.classList.add('item');
            if (i < this.state.start || i > this.state.end) {
                elem.classList.add('disabled');
            }
            if (i === this.state.current) {
                elem.classList.add('current');
            }
            if (this.state.processed.includes(i)) {
                elem.classList.add('processed');
            }
            if (i === this.state.found) {
                elem.classList.add('found');
            }

            this.container.appendChild(elem);
        }
    }

    init() {
        this.render();
    }
}

const binarySearch = new BinarySearch(Array.from(new Array(20), (x, i) => i + 1));
