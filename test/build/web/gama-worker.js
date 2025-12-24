

// Minimal WASI polyfill for the necessary imports
const _wasi_snapshot_preview1 = {
  proc_exit: (code) => {
    console.log(`Process exited with code: ${code}`);
  },
  fd_write: (fd, iov, iovcnt, pnum) => {
    // WebAssembly memory access
    const memory = p.instance.exports.memory;
    const buffer = new Uint8Array(memory.buffer);

    let totalWritten = 0;

    for (let i = 0; i < iovcnt; i++) {
      const iovPtr = iov + i * 8; // Each iovec is 8 bytes (pointer + length)
      const ptr = new Uint32Array(buffer.buffer, iovPtr, 1)[0];
      const len = new Uint32Array(buffer.buffer, iovPtr + 4, 1)[0];

      const str = new TextDecoder().decode(buffer.subarray(ptr, ptr + len));
      console.log(str);
      totalWritten += len;
    }

    // Write number of bytes written
    new Uint32Array(p.instance.exports.memory.buffer, pnum, 1)[0] = totalWritten;
    return 0; // Success
  },
  fd_read: (fd, iov, iovcnt, pnum) => {
    // Not implemented - return 0 for no data
    return 0;
  },
  fd_close: (fd) => {
    return 0; // Success
  },
  fd_fdstat_get: (fd, buf) => {
    // Simplified implementation - return basic stats for stdout/stderr
    const mem = new Uint8Array(p.instance.exports.memory.buffer);
    mem[buf] = 1; // filetype = wasi.FILETYPE_CHARACTER_DEVICE
    mem[buf + 1] = 0; // rights
    mem[buf + 2] = 0;
    mem[buf + 3] = 0;
    mem[buf + 4] = 0;
    mem[buf + 5] = 0;
    mem[buf + 6] = 0;
    mem[buf + 7] = 0;
    return 0; // Success
  },
  fd_seek: (fd, offset, whence, newOffset) => {
    return 28; // ENOTSUP: Not supported
  },
  random_get: (buf, bufLen) => {
    const memory = p.instance.exports.memory;
    const buffer = new Uint8Array(memory.buffer, buf, bufLen);
    crypto.getRandomValues(buffer);
    return 0; // Success
  },
  clock_time_get: (id, precision, timePtr) => {
    const now = BigInt(Date.now()) * 1000000n; // Convert to nanoseconds
    const memory = p.instance.exports.memory;
    const view = new DataView(memory.buffer);
    view.setBigUint64(timePtr, now, true); // littleEndian = true
    return 0; // Success
  },
  environ_get: (envc, envp) => {
    return 0;
  },
  environ_sizes_get: (envc, envs) => {
    new Uint32Array(p.instance.exports.memory.buffer, envc, 1)[0] = 0;
    new Uint32Array(p.instance.exports.memory.buffer, envs, 1)[0] = 0;
    return 0;
  },
  args_get: (argv, argvBuf) => {
    return 0;
  },
  args_sizes_get: (argc, argvBufSize) => {
    new Uint32Array(p.instance.exports.memory.buffer, argc, 1)[0] = 0;
    new Uint32Array(p.instance.exports.memory.buffer, argvBufSize, 1)[0] = 0;
    return 0;
  },
  path_open: (fd, dirflags, path, path_len, oflags, fs_rights_base,
    fs_rights_inheriting, fd_flags, opened_fd) => {
    return 1; // Error code for unsupported
  },
  path_readlink: (fd, path, path_len, buf, bufLen, result_len) => {
    return 1; // Error code for unsupported
  },
  path_remove_directory: (fd, path, path_len) => {
    return 1; // Error code for unsupported
  },
  path_rename: (fd, old_path, old_path_len, new_fd, new_path, new_path_len) => {
    return 1; // Error code for unsupported
  },
  path_symlink: (old_path, old_path_len, fd, new_path, new_path_len) => {
    return 1; // Error code for unsupported
  },
  path_unlink_file: (fd, path, path_len) => {
    return 1; // Error code for unsupported
  },
  fd_sync: (fd) => {
    return 0; // Success
  },
  fd_datasync: (fd) => {
    return 0; // Success
  },
  fd_allocate: (fd, offset, len) => {
    return 28; // ENOTSUP: Not supported
  },
  fd_filestat_get: (fd, buf) => {
    return 28; // ENOTSUP: Not supported
  },
  fd_filestat_set_size: (fd, size) => {
    return 28; // ENOTSUP: Not supported
  },
  fd_filestat_set_times: (fd, atim, mtim, fst_flags) => {
    return 28; // ENOTSUP: Not supported
  },
  fd_prestat_get: (fd, buf) => {
    return 1; // Error code for unsupported
  },
  fd_prestat_dir_name: (fd, path, path_len) => {
    return 1; // Error code for unsupported
  },
  poll_oneoff: (in_ptr, out_ptr, nsubscriptions, nevents_ptr) => {
    return 28; // ENOTSUP: Not supported
  },
  sched_yield: () => {
    return 0; // Success
  },
  sock_recv: (fd, ri_data, ri_flags, ro_databuf, ro_flags) => {
    return 28; // ENOTSUP: Not supported
  },
  sock_send: (fd, si_data, si_flags, nwritten) => {
    return 28; // ENOTSUP: Not supported
  },
  sock_shutdown: (fd, how) => {
    return 28; // ENOTSUP: Not supported
  },
  fd_pwrite: (fd, iov, iovcnt, offset, pnum) => {
    return 28; // ENOTSUP: Not supported
  },
  fd_prestat_get: (fd, buf) => {
    return 1; // Error code for unsupported
  },
  fd_prestat_dir_name: (fd, path, path_len) => {
    return 1; // Error code for unsupported
  },
  fd_fdstat_set_flags: (fd, flags) => {
    return 28; // ENOTSUP: Not supported
  },
  fd_filestat_set_times: (fd, atim, mtim, fst_flags) => {
    return 28; // ENOTSUP: Not supported
  },
  path_create_directory: (fd, path, path_len) => {
    return 28; // ENOTSUP: Not supported
  },
  path_filestat_get: (fd, flags, path, path_len, buf) => {
    return 28; // ENOTSUP: Not supported
  },
  path_filestat_set_times: (fd, flags, path, path_len, atim, mtim, fst_flags) => {
    return 28; // ENOTSUP: Not supported
  },
  path_link: (old_fd, old_flags, old_path, old_path_len, new_fd, new_path, new_path_len) => {
    return 28; // ENOTSUP: Not supported
  },
  fd_advise: (fd, offset, len, advice) => {
    return 28; // ENOTSUP: Not supported
  },
  fd_allocate: (fd, offset, len) => {
    return 28; // ENOTSUP: Not supported
  },
  fd_close: (fd) => {
    return 0; // Success
  },
  fd_datasync: (fd) => {
    return 0; // Success
  },
  fd_fdstat_get: (fd, buf) => {
    // Simplified implementation - return basic stats for stdout/stderr
    const mem = new Uint8Array(p.instance.exports.memory.buffer);
    mem[buf] = 1; // filetype = wasi.FILETYPE_CHARACTER_DEVICE
    mem[buf + 1] = 0; // rights
    mem[buf + 2] = 0;
    mem[buf + 3] = 0;
    mem[buf + 4] = 0;
    mem[buf + 5] = 0;
    mem[buf + 6] = 0;
    mem[buf + 7] = 0;
    return 0; // Success
  },
  fd_fdstat_set_flags: (fd, flags) => {
    return 28; // ENOTSUP: Not supported
  },
  fd_filestat_get: (fd, buf) => {
    return 28; // ENOTSUP: Not supported
  },
  fd_filestat_set_size: (fd, size) => {
    return 28; // ENOTSUP: Not supported
  },
  fd_filestat_set_times: (fd, atim, mtim, fst_flags) => {
    return 28; // ENOTSUP: Not supported
  },
  fd_pread: (fd, iov, iovcnt, offset, nread) => {
    return 28; // ENOTSUP: Not supported
  },
  fd_prestat_get: (fd, buf) => {
    return 1; // Error code for unsupported
  },
  fd_prestat_dir_name: (fd, path, path_len) => {
    return 1; // Error code for unsupported
  },
  fd_readdir: (fd, buf, buf_len, cookie, buf_used) => {
    return 28; // ENOTSUP: Not supported
  },
  fd_renumber: (fd, to) => {
    return 28; // ENOTSUP: Not supported
  },
  fd_seek: (fd, offset, whence, newOffset) => {
    return 28; // ENOTSUP: Not supported
  },
  fd_sync: (fd) => {
    return 0; // Success
  },
  fd_tell: (fd, offset) => {
    return 28; // ENOTSUP: Not supported
  },
  path_exists: (fd, path, path_len) => {
    return 28; // ENOTSUP: Not supported
  },
  path_filestat_get: (fd, flags, path, path_len, buf) => {
    return 28; // ENOTSUP: Not supported
  },
  fd_writev: (fd, iov, iovcnt, pnum) => {
    return 28; // ENOTSUP: Not supported
  },
  fd_readv: (fd, iov, iovcnt, pnum) => {
    return 28; // ENOTSUP: Not supported
  },
  path_symlink: (old_path, old_path_len, fd, new_path, new_path_len) => {
    return 28; // ENOTSUP: Not supported
  },
  sock_recv: (fd, ri_data, ri_flags, ro_databuf, ro_flags) => {
    return 28; // ENOTSUP: Not supported
  },
  sock_send: (fd, si_data, si_flags, nwritten) => {
    return 28; // ENOTSUP: Not supported
  },
  random_get: (buf, bufLen) => {
    const memory = p.instance.exports.memory;
    const buffer = new Uint8Array(memory.buffer, buf, bufLen);
    crypto.getRandomValues(buffer);
    return 0; // Success
  }
};

// Additional fallback for any WASI functions that may not be explicitly defined
// This dynamically adds functions that are requested but not defined
const proxyHandler = {
  get: function(target, prop) {
    if (prop in target) {
      return target[prop];
    }
    // Return a generic function that returns "not supported" error
    return function() {
      console.warn(`Called unimplemented WASI function: ${prop}`);
      return 28; // ENOTSUP: Not supported
    };
  }
};


const wasi_snapshot_preview1 = new Proxy(_wasi_snapshot_preview1, proxyHandler);

// begining

let p = {
  instance: undefined,
  module: undefined,
  canvas: undefined,
  ctx: undefined,
  running: true,
  state: 'unready',
  queue: [],
  init: { width: 500, height: 500, title: "gama app" },
  last_t: Date.now(),
};

// Create a proxy to catch any missing WASI functions
const gapi = {
  init: (width, height, title) => {
    console.log("gm_init called");
    p.init.width = width;
    p.init.height = height;
    p.init.title = takeString(title);
  },
  log: function(txt) {
    console.log(txt);
  },
  quit: () => {
    p.running = false;
    console.info("gama eited");
  },
  draw_line: (x1, y1, x2, y2, size, r, b, g, a) => {
    p.queue.push({
      type: 'draw/line',
      start: [x1, y1],
      stop: [x2, y2],
      color: [r, g, b, a]
    });
  },
  draw_rect: (x, y, w, h, r, g, b, a) => {
    p.queue.push({
      type: 'draw/rect',
      pos: [x, y],
      size: [w, h],
      color: [r, g, b, a]
    });
  },
  draw_circle: (x, y, rad, r, g, b, a) => {
    p.queue.push({
      type: 'draw/circle',
      pos: [x, y],
      radius: r,
      color: [r, g, b, a],
    });
  },
  draw_text: (x, y, size, txt, font, style, r, g, b, a) => {
    p.queue.push({
      type: 'draw/text',
      pos: [x, y],
      text: takeString(txt),
      style: style,
      font: takeString(font),
      color: [r, g, b, a]
    });
  },
  set_bg_color: (r, g, b, a) => {
    p.queue.push({
      type: 'set/bg',
      color: [r, g, b, a],
    });
  },
  get_mouse_move: (x_ptr, y_ptr) => null,
  mouse_get: (x_ptr, y_ptr) => null,
  mouse_down: () => 0,
  mouse_pressed: () => 0,
  yield: (dt_ptr) => {
    const now = Date.now();
    const dt = (now - p.last_t) / 1000;
    setDoublePtr(dt_ptr, dt);
    p.last_t = now;
    return 1;
  }
};

function takeString(ptr) {
  const arr = new Uint8Array(p.instance.exports.memory.buffer);
  let end = ptr;
  while (arr[end] !== 0 && end - ptr < 100 && end < arr.length) {
    end++;
  }
  return new TextDecoder().decode(arr.slice(ptr, end));
}



self.onmessage = function(event) {
  if (p.state == 'unready') {
    // Combined import object with both WASI and GAPI imports
    const imports = {
      wasi_snapshot_preview1,
      env: gapi,  // In case it's also imported as 'env'
      gapi: gapi,
    };

    WebAssembly.instantiateStreaming(fetch(event.data), imports).then(({ instance, module }) => {
      p.instance = instance;
      p.module = module;
      console.log(instance);
      console.log('running gama_setup');
      const mode = instance.exports.gama_mode();

      if (mode != 2) {
        console.error("Gama program in invalid mode: ", mode);
        alert(`Gama module reports invalid mode ${mode}, mode should be == 2(setup mode)`);
      }

      const res = instance.exports.gama_setup();
      console.log('setup exited with status ', res, 'sending queue and init signal');
      postQueue();
      self.postMessage({
        type: "initialize",
        ...p.init,
      });
      p.state = 'ready';
      console.info("worker state switching to READY")
    }).catch(error => {
      console.error("Error instantiating WebAssembly module:", error);
    });
  } else if (p.state == 'ready') {
    p.instance.exports.gama_loop();
    postQueue();
    self.postMessage(null);
  } else {
    console.error("worker received unexpeced event: ", event, " while in state ", p.state);
  }
};
function postQueue() {
  for (const msg of p.queue) {
    self.postMessage(msg);
  }
  p.queue = [];
}

function setDoublePtr(ptr, val) {
  const float64View = new Float64Array(p.instance.exports.memory.buffer);

  // 4. Assign the value to the specific memory address
  // We divide by 8 because Float64Array indices are in 8-byte steps
  float64View[ptr / 8] = val;
}
