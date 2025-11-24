export default function RulesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Rules
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          Official rules and guidelines for the hackathon
        </p>

        <div className="prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none">
          <div className="bg-muted/50 border border-border rounded-lg p-6 flex flex-col space-y-4">
            <p className="text-muted-foreground">
              This is a multidisciplinary hackathon where we will work on Apps that make BB better!
            </p>
            <p className="text-muted-foreground">
              You will be a part of a Team, but your points will be individual based on completing challenges
            </p>
            <p className="text-muted-foreground">
              Being higher on the leaderboarder means you will have higher priority for prizes
            </p>
            <p className="text-muted-foreground">
              There will be three main events during the hackathon, with three deliveries
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
