import Image from "next/image";

const Page: React.FC = () => {
	return (
		
		<div className="flex flex-col md:flex-row">
		<div className="w-full md:w-1/2">
		<main className="content">
		<div className="">
		<section className="py-12  bg-blue-50">
		<div className="">
			<div className=" items-center">
				<h1 className="mr-10 font-feeling-passionate			 text-right text-slate-500 text-4xl lg:text-5xl ">Hi, ich bin Sarah</h1>
			
			<div className="xl mx-auto px-4 py-8">
				<h2 className="mr-10 text-2xl md:text-4xl text-right text-slate-500">Selbstständige Resilienzmentorin, Pflegefachkraft und Dozentin für Gesundheitsberufe.
				</h2>
				<p className="mr-10 mt-4 text-lg text-slate-500 text-right">
					Es gab eine Zeit, da fühlte sich mein Alltag an wie ein einziger Kraftakt. Ich bin morgens aufgestanden und wusste eigentlich schon, dass mir alles zu viel sein wird.<br/><br/> Ich war immer engagiert, wollte meine Aufgaben gut machen – und trotzdem wurde alles immer schwerer.<br/><br/>

Ich hatte kaum noch Freude an den Dingen, die mir früher Kraft gegeben haben. Ich wusste nicht mehr, was mich wirklich glücklich macht – ich war einfach nur noch erschöpft.<br/><br/>

Damals hätte ich nie gesagt, dass ich auf dem Weg ins Burnout bin. Für mich war das einfach „normal“. Erst im Rückblick wurde mir klar, wie sehr ich über meine Grenzen gegangen bin. Wie oft mein Körper Signale gesendet hat – Erschöpfung, Hautprobleme, innere Unruhe – und ich trotzdem weitergemacht habe.<br/><br/>

Lange habe ich einfach meine Symptome behandelt und sämtliche Ärzt*innen aufgesucht, damals wusste ich auch nicht wo ich anfangen sollte, etwas zu verändern. Selbst als ich am Tiefpunkt ankam und nicht mehr funktioniert habe, war mir zwar klar, dass sich etwas verändern muss, aber ich wusste nicht was und wo ich anfangen sollte. Alles war zu viel. Die Erschöpfung lag wie ein Schleier über allem – und die Verbindung zu mir selbst war nicht mehr vorhanden.<br/><br/>

Heute weiß ich: Dauerhafte Schlappheit, Gereiztheit oder Leere sind keine Zustände, die wir einfach hinnehmen müssen und unser eigener Einflussbereich ist größer, als ich es je für möglich gehalten hätte.<br/><br/>

Echte Veränderung beginnt da, wo wir aufhören, unsere Erschöpfung als normal zu betrachten – und anfangen, uns selbst wieder zuzuhören
				</p>
	</div>			
			</div>
			
		</div>
		</section>
		</div>
					
		</main>
		</div>
<div className="w-full md:w-1/2">
<Image src="/portrait01.png" alt="Sarah Maria Huber" height="1200" width="780" />
</div>

		</div>
		

	)
};

export default Page;