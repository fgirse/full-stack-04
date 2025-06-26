// filepath: src/hooks/use-toast.ts
export default function useToast() {
  return {
    toast: (msg: string) => alert(msg)
  }
}