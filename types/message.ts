type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

type Provider = {
  id: string;
  name: string;
};

type Model = {
  id: string;
  name: string;
  providerId: string;
};

export { type Message, type Provider, type Model };
