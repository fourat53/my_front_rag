import CardExample from "@/components/layout/card-example";
import FormExample from "@/components/layout/form-example";

export default function TestPage() {
  return (
    <div className="h-screen flex items-center justify-center gap-5">
      <CardExample />
      <FormExample />
    </div>
  );
}
