/* eslint-disable prettier/prettier */

export const General = {
  handleFormatingFilename(File: string): string {
    let file: any = '';
    let firstFileName = '';
    const lengthFile = 30;

    if (!File) return '';
    const thereAreSpaces = /\s/.test(File);

    if (File.length < lengthFile) firstFileName = File;

    if (thereAreSpaces && File.length >= lengthFile) {
      file = File.split(' ');
      firstFileName = file[file.length - 1];
    }

    if (!thereAreSpaces && File.length >= lengthFile) {
      file = File.split('.');
      firstFileName = file[0].split('')[file.length - 1] + '.' + file[1];
    }

    return firstFileName;
  }
};
