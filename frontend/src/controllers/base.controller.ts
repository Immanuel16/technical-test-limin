import { ref, type Ref } from 'vue';

export abstract class BaseController {
  public isLoading: Ref<boolean> = ref(false);
  public errorMessage: Ref<string | null> = ref(null);

  protected async executeAsync<T>(task: () => Promise<T>): Promise<T | null> {
    this.isLoading.value = true;
    this.errorMessage.value = null;
    try {
      return await task();
    } catch (err: unknown) {
      this.errorMessage.value =
        err instanceof Error ? err.message : 'Terjadi kesalahan sistem';
      return null;
    } finally {
      this.isLoading.value = false;
    }
  }
}
