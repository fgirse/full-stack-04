export function useToast() {
  return {
    toast: (message) => {
      console.log(message);
    },
  };
}