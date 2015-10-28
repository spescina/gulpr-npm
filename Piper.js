var Piper = function (process) {
    var Process = process;

    function pipe(pipe) {
        Process = Process.pipe(pipe);
    }

    return {
        pipe: pipe
    }
};

module.exports = Piper;