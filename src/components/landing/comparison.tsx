import { Check, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type CellValue = true | false | string;

interface ComparisonRow {
  feature: string;
  clauseforge: CellValue;
  pandadoc: CellValue;
  docusign: CellValue;
  lawdepot: CellValue;
}

const comparisonData: ComparisonRow[] = [
  {
    feature: "Starting Price",
    clauseforge: "$19/mo flat",
    pandadoc: "$35/user/mo",
    docusign: "$25/user/mo",
    lawdepot: "$40/mo",
  },
  {
    feature: "AI Contract Generation",
    clauseforge: true,
    pandadoc: false,
    docusign: false,
    lawdepot: false,
  },
  {
    feature: "Red-Flag Detection",
    clauseforge: true,
    pandadoc: false,
    docusign: false,
    lawdepot: false,
  },
  {
    feature: "Price for 5 Users",
    clauseforge: "$19/mo",
    pandadoc: "$175/mo",
    docusign: "$125/mo",
    lawdepot: "$40/mo",
  },
  {
    feature: "Free Tier",
    clauseforge: true,
    pandadoc: "E-sign only",
    docusign: false,
    lawdepot: false,
  },
  {
    feature: "E-Signature",
    clauseforge: true,
    pandadoc: true,
    docusign: true,
    lawdepot: false,
  },
  {
    feature: "Clause Library",
    clauseforge: true,
    pandadoc: false,
    docusign: false,
    lawdepot: true,
  },
  {
    feature: "Client Portal",
    clauseforge: true,
    pandadoc: true,
    docusign: false,
    lawdepot: false,
  },
];

function CellContent({ value }: { value: CellValue }) {
  if (value === true) {
    return <Check className="mx-auto h-5 w-5 text-green-600" />;
  }
  if (value === false) {
    return <X className="mx-auto h-5 w-5 text-red-400" />;
  }
  return (
    <span className="text-sm text-muted-foreground">{value}</span>
  );
}

export function Comparison() {
  return (
    <section id="comparison" className="bg-muted/40 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold">How we compare</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            AI-generated contracts at a flat price — no per-user fees.
          </p>
        </div>
        <div className="mt-12 overflow-x-auto rounded-lg border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Feature</TableHead>
                <TableHead className="text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-bold text-primary">ClauseForge</span>
                    <Badge variant="secondary" className="text-xs">
                      You are here
                    </Badge>
                  </div>
                </TableHead>
                <TableHead className="text-center">PandaDoc</TableHead>
                <TableHead className="text-center">DocuSign</TableHead>
                <TableHead className="text-center">LawDepot</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisonData.map((row) => (
                <TableRow key={row.feature}>
                  <TableCell className="font-medium">{row.feature}</TableCell>
                  <TableCell className="bg-primary/5 text-center">
                    <CellContent value={row.clauseforge} />
                  </TableCell>
                  <TableCell className="text-center">
                    <CellContent value={row.pandadoc} />
                  </TableCell>
                  <TableCell className="text-center">
                    <CellContent value={row.docusign} />
                  </TableCell>
                  <TableCell className="text-center">
                    <CellContent value={row.lawdepot} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}
