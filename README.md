### 使用的nodejs版本是v22.14.0

### 安装pnpm

```sh
npm install -g pnpm@latest-10
```

### 初始化

```sh
pnpm install
```

### 编译（开发）

```sh
pnpm dev
```

### 编译（生产）

```sh
pnpm build
```
> **警告**
>
> [./src/assets/fonts/](./src/assets/fonts)下的字体文件默认未经过裁剪，包含全部字符。
> 如果需要裁剪字符，请修改[./unicodes.txt](./unicodes.txt)后使用[sub_setter.py](sub_setter.py)自行裁剪。

### 效果图

![效果图](./markdown/Snipaste_2025-02-20_20-17-18.png)


