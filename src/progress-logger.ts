import { MultiBar, Presets, SingleBar } from "cli-progress";
import { Logger } from "./logger";

export class ProgressLogger extends Logger {
  private readonly multiProgressBar = new MultiBar(
    {
      clearOnComplete: false,
      hideCursor: true,
      format: " {bar} | {id} | {value}/{total}",
    },
    Presets.shades_grey,
  );

  private readonly progressBars: Record<
    string,
    { value: number; total: number; id: string; bar: SingleBar }
  > = {};

  static progress(id: string, value: number, total?: number) {
    const logger = new ProgressLogger(id);
    return logger.progress(id, value, total);
  }

  progressStop() {
    this.multiProgressBar.stop();
  }

  progress(id: string, value: number, total?: number): void {
    if (this.progressBars[id]) {
      this.progressBars[id].bar.update(value, { id });
      return;
    }

    if (!total) {
      throw new Error(
        "Must provide a total value when calling progress the first time",
      );
    }

    this.progressBars[id] = {
      id,
      value,
      total,
      bar: this.multiProgressBar.create(total, 0, { id }),
    };
  }
}
